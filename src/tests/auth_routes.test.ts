
import request from 'supertest'
import app from '../server'
import mongoose from 'mongoose'
import User from "../models/user_model";



beforeAll(async ()=>{
    //clear Posts collection
    await User.remove({email:email})
})

afterAll(async ()=>{
    await User.remove({ email: email });
    mongoose.connection.close()
})

const email="test1@a.com"
const wrongEmail="test2@a.com"
const password="123456789"
const wrongPassword="1234567890"
let accessToken = "";
let refreshToken = "";

describe("This is Auth API test",()=>{
    test("Test register API", async ()=>{
        const response =await request(app).post('/auth/register')
        .send({"email":email, "password":password})
    expect(response.statusCode).toEqual(200)
    })

    test("Test login API", async ()=>{
        const response =await request(app).post('/auth/login')
        .send({"email":email, "password":password})
    
    expect(response.statusCode).toEqual(200)
    })

    test("Test register taken email API", async ()=>{
        const response =await request(app).post('/auth/register')
        .send({"email":email, "password":password})
    
    expect(response.statusCode).not.toEqual(200)
    })

    test("Test login wrong email API", async ()=>{
        const response =await request(app).post('/auth/login')
        .send({"email":wrongEmail, "password":password})
    
    expect(response.statusCode).not.toEqual(200)
    })

    test("Test login wrong password API", async ()=>{
        const response =await request(app).post('/auth/login')
        .send({"email":email, "password":wrongPassword})
    
    expect(response.statusCode).not.toEqual(200)
    })
    
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  test("test refresh token", async () => {
    //wait untill access token is expiered
    await sleep(3000);
    let response = await request(app)
      .post("/auth/test")
      .set({ authorization: "barer " + accessToken });
    expect(response.statusCode).not.toEqual(200);

    response = await request(app)
      .post("/auth/refresh")
      .set({ authorization: "barer " + refreshToken });
    expect(response.statusCode).toEqual(200);

    accessToken = response.body.access_token;
    refreshToken = response.body.refresh_token;
    expect(accessToken).not.toBeNull();
    expect(refreshToken).not.toBeNull();

    response = await request(app)
      .post("/auth/test")
      .set({ authorization: "barer " + accessToken });
    expect(response.statusCode).toEqual(200);
  });
});

