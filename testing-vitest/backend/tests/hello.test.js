import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../app.js";

describe("GET /hello", () => {
  it("should return hello message", async () => {
    const res = await request(app).get("/hello");

    expect(res.statusCode).toBe(200);

    expect(res.body).toEqual({
      message: "Hello from API",
    });
  });
});