import { mongo } from "@/lib/axios"

async function register(payload: {
    "restaurant": {
        "name": string,
        "address": string,
        "rif": string,
        "logo": string
    },
    "user": {
        "fullname": string,
        "email": string,
        "dni": string,
        "password": string
    }
}) {
    try {
        const { data } = await mongo.post('/api/auth/register', payload)

        return { data, ok: true }

    } catch (err) {

        console.log(err)

        return { ok: false }
    }
}

export default register