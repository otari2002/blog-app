const express = require('express')
const router = express.Router()
const prisma = require('../prisma/prismaClient')

const getAll = async (req, res) => {
	await prisma.category
		.findMany({
			include: {
				articles: true,
			}
		})
		.then((categories) => {
			const categoryWithCount = categories.map((category) => ({
				name: category.name,
				count: category.articles.length,
			}));
			res.status(200).json(categoryWithCount)
		})
		.catch((err) => {
			res.status(500).json(err)
		})
}
const getArticlesByCategory = async (req, res) => {
	const take = Number(req.query.take) || 10
	const skip = Number(req.query.skip) || 0
	const name  = req.params.name;
	await prisma.article
		.findMany({
			skip: skip,
			take: take,
			where: {
				published: true,
				categories: {
					some: {
						name
					},
				},
			},
			include:{
				categories: true
			},
			orderBy: {
				createdAt: 'desc',
			},
		})
		.then((categories) => {
			res.status(200).json(categories)
		})
		.catch((err) => {
			res.status(500).json(err)
		})
}

const createCategory = async (req, res) => {
	const category = req.body
	await prisma.category
		.create({
			data: {
				name: category.name,
			},
		})
		.then((category) => {
			res.status(200).json(category)
		})
		.catch((err) => {
			res.status(500).json(err)
		})
}

const deleteCategory = async (req, res) => {
	const categoryName = req.params.name
	const category = await prisma.category.findUnique({
		where: { name: categoryName },
		include: { articles: true },
	});
	const articleIds = category.articles.map((article) => article.id);

    for (const articleId of articleIds) {
      await prisma.article.update({
        where: { id: articleId },
        data: { categories: { disconnect: { name: categoryName } } },
      });
    }
  
	await prisma.category.delete(
		{ where: { name: categoryName } }
	)
	.then((category) => {
		res.status(200).json(category)
	})
	.catch((err) => {
		res.status(500).json(err)
	})
}


router.get('/', getAll)
router.get('/:name', getArticlesByCategory)
router.post('/', createCategory)
router.delete('/:name', deleteCategory)

module.exports = router
