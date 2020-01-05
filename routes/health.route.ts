import { Request, Response } from "express";

export let HealthRoute = (req: Request, res: Response) => {
    // set the response header to text/plain
    res.set({
        "Content-Type": "text/html;charset=utf-8"
    })
    return res.status(200).send(`<h1>The Server is healthy<h1> <br> The current FULL ENV is = ${process.env.NODE_ENV}`)
}