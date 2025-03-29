Deno.serve((req) => {
  console.log("Received request for", req.url);
  return new Response("Hello world");
});