import request from "supertest";
import {app} from "../../app";

it('response with details about the user', async () => {
    const cookie = await signin()

    const res = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", `${cookie}`)
    .send()
    .expect(200);
})