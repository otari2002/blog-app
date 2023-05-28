const express = require('express')
const router = express.Router()
const prisma = require('../prisma/prismaClient')

const getAll = async (req, res) => {
	const take = Number(req.query.take) || 10
	const skip = Number(req.query.skip) || 0
	await prisma.comment
		.findMany({
			skip: skip,
			take: take,
		})
		.then((comments) => {
			res.status(200).json(comments)
		})
		.catch((err) => {
			res.status(500).json(err)
		})
}

const getArticleComments = async (req, res) => {
	const id = Number(req.params.id)
	await prisma.comment
		.findMany({
			where: {
				articleId: id,
			},
		})
		.then((comment) => {
			if (comment) res.status(200).json(comment)
			else res.status(404).json({ message: 'no comment found' })
		})
		.catch((err) => {
			res.status(500).json(err)
		})
}

const createComment = async (req, res) => {
	const comment = req.body
	await prisma.comment
		.create({
			data: {
				content: comment.content,
				authorEmail: comment.authorEmail,
				articleId: Number(comment.articleId),
			},
		})
		.then((comment) => {
			res.status(200).json(comment)
		})
		.catch((err) => {
			res.status(500).json(err)
		})
}

const updateComment = async (req, res) => {
	const comment = req.body
	await prisma.comment
		.update({
			where: {
				id: Number(comment.id),
			},
			data: {
				content: comment.content,
				authorEmail: comment.authorEmail,
				articleId: Number(comment.articleId),
			},
		})
		.then((comment) => {
			res.status(200).json(comment)
		})
		.catch((err) => {
			res.status(500).json(err)
		})
}

const deleteCommentById = async (req, res) => {
	const id = Number(req.params.id)
	await prisma.comment
		.delete({
			where: {
				id: id,
			},
		})
		.then((comment) => {
			res.status(200).json(comment)
		})
		.catch((err) => {
			res.status(500).json(err)
		})
}


router.get('/', getAll)
router.get('/:id', getArticleComments)
router.post('/', createComment)
router.patch('/', updateComment)
router.delete('/:id', deleteCommentById)

module.exports = router
