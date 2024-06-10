import { mongo } from "@/lib/axios"

async function login(payload: {
    email: string,
    password: string
}) {
    try {
        const { data } = await mongo.post('/api/auth/login', payload)

        return { data, ok: true }

    } catch (err) {

        console.log(err)

        return { ok: false }
    }
}

export default login