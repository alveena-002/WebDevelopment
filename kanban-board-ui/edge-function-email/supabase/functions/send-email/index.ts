import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

Deno.serve(async (req) => {
  try {
    const { email, name } = await req.json();

    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Welcome!",
      html: `
        <h2>Hello ${name} 👋</h2>
        <p>Your record has been added successfully.</p>
        <p>Welcome to our application!</p>
      `,
    });

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
});