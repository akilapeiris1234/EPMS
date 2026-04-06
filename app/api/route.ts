export async function GET() {
  return new Response(JSON.stringify({ message: "Guard API" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
