import Express from "express";
import usersRouter from "./router/usersRouter"
import itemRouter from "./router/itemRouter"
import borrowRouter from "./router/borrowRouter"

const app = Express()
/** allow to read a body request with JSON format */

app.use(Express.json())

/** prefix from user */
app.use(`/users`, usersRouter)

/** prefix from item */
app.use(`/item`, itemRouter)

/** prefix from borrow */
app.use(`/borrow`, borrowRouter)

const PORT = 1992
app.listen(PORT, () => {
    console.log(`Server Peminjaman Barang run on port ${PORT}`);
})