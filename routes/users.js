const express = require('express')
const router = express.Router()
const prisma = require('../prisma/prismaClient')
const bcrypt = require('bcrypt')

const getAll = async (req, res) => {
	await prisma.user
		.findMany()
		.then((users) => {
			res.status(200).json(users)
		})
		.catch((err) => {
			res.status(500).json(err)
		})
}

const getArticlesByUser = async (req, res) => {
	const take = parseInt(req.query.take) || 30;
	const skip = parseInt(req.query.skip) || 0;
	await prisma.article
		.findMany({
			skip: skip,
			take: take,
			where: {
				authorName: req.params.name,
			},	
			include:{
				categories: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		})
		.then((articles) => {
			res.status(200).json(articles)
		})
		.catch((err) => {
			res.status(500).json(err)
		})
}


const createUser = async (req, res) => {
	const user = req.body
	const existingUser = await prisma.user.findUnique({
		where: {
		  name: user.name,
		}
	});
	if(existingUser){
		res.status(200).json({"message": "This username already exists !"})
	}else{
		const hashedPassword = await bcrypt.hash(user.password, 10);
		await prisma.user.create({
			data: {
				name: user.name,
				email: user.email,
				password: hashedPassword,
				role: user.role,
				verified: user.verified ? user.verified : "PENDING" 
			},
		})
		.then(() => {
			res.status(200).json({"message": "User created Successfully !"})
		})
		.catch((err) => {
			res.status(500).json(err)
		})
	}
}

const updateUser = async (req, res) => {
	const user = req.body
	const hashedPassword = await bcrypt.hash(user.password, 10);
	await prisma.user
		.update({
			where: {
				name: user.name,
			},
			data: {
				name: user.name,
				email: user.email,
				password: hashedPassword,
				role: user.role
			},
		})
		.then((user) => {
			res.status(200).json(user)
		})
		.catch((err) => {
			res.status(500).json(err)
		})
}

const deleteUser = async (req, res) => {
	const userName = req.params.name;
	const user = await prisma.user.findUnique({
		where: {
		  name: userName,
		},
		include: {
		  articles: {
			include: {
			  comments: true,
			},
		  },
		},
	  });
	await prisma.comment.deleteMany({
		where: {
			authorEmail: user.email,
		}
	});
	for (const article of user.articles) {
		await prisma.comment.deleteMany({
			where: {
				articleId: article.id,
			}
		});
		await prisma.article.delete({
			where: {
				id: article.id,
			},
		});
	}
	await prisma.user.delete({
		where: {
			name: userName,
		},
	})
	.then((user) => {
		res.status(200).json(user)
	})
	.catch((err) => {
		res.status(500).json(err)
	})
}

const acceptUser = async (req, res) => {
	const user = req.body
	await prisma.user
		.update({
			where: {
				name: user.name,
			},
			data: {
				verified: "ACCEPTED"
			},
		})
		.then((user) => {
			res.status(200).json(user)
		})
		.catch((err) => {
			res.status(500).json(err)
		})
}


router.get('/', getAll)
router.get('/:name', getArticlesByUser)
router.post('/', createUser)
router.patch('/', updateUser)
router.patch('/accept', acceptUser)
router.delete('/:name', deleteUser)

module.exports = router
