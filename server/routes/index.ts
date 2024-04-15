export default defineEventHandler((event) => {
  setResponseHeader(event, "Content-Type", "text/plain");
  return "Start by editing <code>server/routes/index.ts</code>.";
});
