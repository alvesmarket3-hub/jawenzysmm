import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const apiKey = req.headers.get("X-Api-Key") || req.headers.get("Api-Key");

    // Authenticate via API key
    let userId: string | null = null;
    if (apiKey) {
      const { data: keyRow } = await adminClient
        .from("api_keys")
        .select("user_id")
        .eq("key_value", apiKey)
        .maybeSingle();
      if (keyRow) {
        userId = keyRow.user_id;
        await adminClient.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("key_value", apiKey);
      }
    }

    if (!userId) {
      return new Response(JSON.stringify({ error: "Invalid or missing API key" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const action = url.searchParams.get("action") || "services";

    // GET /smm-api?action=services — list services
    if (action === "services" && req.method === "GET") {
      const { data } = await adminClient.from("services").select("*").eq("is_active", true).order("platform");
      return new Response(JSON.stringify({ services: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST /smm-api?action=add-order — place order
    if (action === "add-order" && req.method === "POST") {
      const body = await req.json();
      const { service_id, link, quantity } = body;

      if (!service_id || !link || !quantity) {
        return new Response(JSON.stringify({ error: "service_id, link, and quantity are required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: service } = await adminClient.from("services").select("*").eq("id", service_id).eq("is_active", true).maybeSingle();
      if (!service) {
        return new Response(JSON.stringify({ error: "Service not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (quantity < service.min_order || quantity > service.max_order) {
        return new Response(JSON.stringify({ error: `Quantity must be between ${service.min_order} and ${service.max_order}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const charge = (Number(service.price_per_1000) * quantity) / 1000;

      const { data: profile } = await adminClient.from("profiles").select("balance").eq("id", userId).maybeSingle();
      if (!profile || Number(profile.balance) < charge) {
        return new Response(JSON.stringify({ error: "Insufficient balance" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: order, error } = await adminClient.from("orders").insert({
        user_id: userId,
        service_id,
        link,
        quantity,
        charge,
        status: "pending",
      }).select().single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const newBalance = Number(profile.balance) - charge;
      await adminClient.from("profiles").update({ balance: newBalance }).eq("id", userId);
      await adminClient.from("transactions").insert({
        user_id: userId,
        amount: -charge,
        type: "order",
        description: `API Order #${order.id.slice(0, 8)} — ${service.name}`,
      });

      return new Response(JSON.stringify({ order_id: order.id, status: "pending", charge }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /smm-api?action=status&order_id=xxx — check order status
    if (action === "status" && req.method === "GET") {
      const orderId = url.searchParams.get("order_id");
      if (!orderId) {
        return new Response(JSON.stringify({ error: "order_id is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: order } = await adminClient.from("orders").select("*").eq("id", orderId).eq("user_id", userId).maybeSingle();
      if (!order) {
        return new Response(JSON.stringify({ error: "Order not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ order_id: order.id, status: order.status, start_count: order.start_count, charge: order.charge }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /smm-api?action=balance — check user balance
    if (action === "balance" && req.method === "GET") {
      const { data: profile } = await adminClient.from("profiles").select("balance").eq("id", userId).maybeSingle();
      return new Response(JSON.stringify({ balance: profile?.balance || 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
