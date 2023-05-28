const express = require('express');  
const router = express.Router(); 
const prisma = require('../prisma/prismaClient')

const getAll = async (req, res) => {
	const take = parseInt(req.query.take) || 10
	const skip = parseInt(req.query.skip) || 0
	await prisma.article
		.findMany({
			include:{
				categories: true,
			},
			skip: skip,
			take: take,
			where: {
				published: true,
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

const getById = async (req, res) => {
	const id = req.params.id
	await prisma.article
		.findFirst({
			where: {
				id: parseInt(id),
			},
			include:{
				categories: true,
			}
		})
		.then((article) => {
			if (article) res.status(200).json(article)
			else res.status(404).json({ message: 'Article not found' })
		})
		.catch((err) => {
			res.status(500).json(err)
		})
}

const createArticle = async (req, res) => {
	const article = req.body;
	await prisma.article
		.create({
			data: {
				title: article.title,
				content: article.content,
				imageUrl: article.imageUrl,
				published: article.published,
				authorName: article.authorName,
				categories: {
					connect: article.categories.map((cat) => ({ name: cat })),
				}
			},
		})
		.then((article) => {
			res.status(200).json(article)
		})
		.catch((err) => {
			res.status(500).json(err)
		})
}

const updateArticle = async (req, res) => {
	const article = req.body
	await prisma.article
		.update({
			where: {
				id: parseInt(article.id),
			},
			data: {
				title: article.title,
				content: article.content,
				imageUrl: article.imageUrl,
				published: article.published,
				authorName: article.authorName,
				categories: {
					set: article.categories.map((cat) => ({ name: cat })),
				},
				updatedAt: new Date(),
			},
		})
		.then((article) => {
			res.status(200).json(article)
		})
		.catch((err) => {
			res.status(500).json(err)
		})
}

const deleteArticleById = async (req, res) => {
	const id = req.params.id
	await prisma.comment
		.deleteMany({
			where: {
				articleId: parseInt(id),
			}
		})
	await prisma.article
		.delete({
			where: {
				id: parseInt(id),
			},
		})
		.then((article) => {
			res.status(200).json(article)
		})
		.catch((err) => {
			res.status(500).json(err)
		})
}


router.get('/:id', getById);
router.get('/', getAll);
router.post('/', createArticle);
router.patch('/', updateArticle);
router.delete('/:id', deleteArticleById);

module.exports = router