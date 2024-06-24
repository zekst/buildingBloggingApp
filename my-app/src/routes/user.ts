import { SignupInput, signinInput } from "@zekst/validation";
import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'

export const userRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string
    JWT_SECRET: string
	}
}>();



userRouter.post('/api/v1/user/signup', async(c) =>{

  const body = await c.req.json();

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())

try{
  const user = await prisma.user.create({
    data: {
      username: body.username,
      password: body.password,
      name: body.name

  }
  })

  const jwt = await sign({
    id: user.id
  }, c.env.JWT_SECRET);

  console.log('edfd')

  return c.text(jwt)
} catch(e){
  c.status(411);
  return c.text('Invalid')
}

  return c.text('check kro signup')
})

// app.post('api/v1/user/signin', async(c) => {
  
//   const body = await c.req.json()

//   const prisma = new PrismaClient({
//     datasourceUrl: c.env?.DATABASE_URL,
// }).$extends(withAccelerate())


// try {
//    const user = await prisma.user.findFirst({
//     where: {
//       username: body.username,
//       password: body.password,
//     }
//    })

//    if(!user){
//     c.status(403);
//     return c.json({
//       message: "nahi hai bhaii"
//     })
//    }

//    const jwt = await sign({
//     id: user.id
//    }, c.env.JWT_SECRET)

//    return jwt;
// } catch(exception){
//   c.status(411);
//   return c.text('Invalid')
// }

// })


userRouter.post('/api/v1/signin', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const user = await prisma.user.findUnique({
		where: {
			username: body.username,
      password: body.password
		}
	});

	if (!user) {
		c.status(403);
		return c.json({ error: "na hawe" });
	}

	const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
	return c.json({ message: jwt, kackhu: "hawe"});
})