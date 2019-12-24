const express = require('express')
const cors = require('cors')
const path = require('path')
const url = require('url')
const puppeteer = require('puppeteer')
const uuid = require('uuid/v4')

const app = express()

const PORT = process.env.PORT || 4000

const getAppUrl = req => url.format({
  host: req.get('host'),
  pathname: req.originalUrl,
  protocol: req.protocol
})

const btnClick = elem => { elem.click() }

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.post('/', async (req, res) => {
  try {
    const { body } = req
    if (!body.descripcion || !body.precio) throw new Error('No info provided')

    const browser = await puppeteer.launch({
      defaultViewport: null,
      headless: true,
    })

    const [page] = await browser.pages()
    await page.goto('https://seminuevos.com')

    await page.$eval('a#loginBtn', btnClick)
    await page.type('input#emailSignIn', 'testmail_adrian@gmail.com')
    await page.type('input#passwordSignIn', 'admin123')

    await Promise.all([
      page.waitForNavigation(),
      page.$eval('button#btnLogin', btnClick),
    ])

    await Promise.all([
      page.waitForNavigation(),
      page.$eval('a.btn-primary', btnClick),
    ])

    await page.waitFor('#dropdown_types ul > li[data-content="autos"] a')
    await page.$eval('#dropdown_types ul > li[data-content="autos"] a', btnClick)

    await page.waitFor('#dropdown_brands ul > li[data-content="acura"] a')
    await page.$eval('#dropdown_brands ul > li[data-content="acura"] a', btnClick)

    await page.waitFor('#dropdown_models ul > li[data-content="ilx"] a')
    await page.$eval('#dropdown_models ul > li[data-content="ilx"] a', btnClick)

    await page.waitFor('#dropdown_subtypes ul > li[data-content="sedan"] a')
    await page.$eval('#dropdown_subtypes ul > li[data-content="sedan"] a', btnClick)

    await page.waitFor('#dropdown_years ul > li[data-content="2018"] a')
    await page.$eval('#dropdown_years ul > li[data-content="2018"] a', btnClick)

    await page.waitFor('#dropdown_provinces ul > li[data-content="nuevo leon"] a')
    await page.$eval('#dropdown_provinces ul > li[data-content="nuevo leon"] a', btnClick)

    await page.waitFor('#dropdown_cities ul > li[data-content="monterrey"] a')
    await page.$eval('#dropdown_cities ul > li[data-content="monterrey"] a', btnClick)

    await page.type('input#input_recorrido', '20000')

    await page.waitFor('#dropdown_mileageType ul > li[data-content="kms."] a')
    await page.$eval('#dropdown_mileageType ul > li[data-content="kms."] a', btnClick)

    await page.type('input#input_precio', body.precio)

    await page.waitFor('#dropdown_negotiable ul > li[data-content="negociable"] a')
    await page.$eval('#dropdown_negotiable ul > li[data-content="negociable"] a', btnClick)

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.$eval('div.footer-button > button', btnClick),
    ])

    await page.waitFor('#input_text_area_review')
    await page.type('#input_text_area_review', body.descripcion)

    const [file1] = await Promise.all([
      page.waitForFileChooser(),
      page.$eval('input#Uploader', btnClick),
    ])
    await file1.accept(['private/315748.jpg'])

    const [file2] = await Promise.all([
      page.waitForFileChooser(),
      page.$eval('input#Uploader', btnClick),
    ])
    await file2.accept(['private/322004.jpg'])

    const [file3] = await Promise.all([
      page.waitForFileChooser(),
      page.$eval('input#Uploader', btnClick),
    ])
    await file3.accept(['private/960825.jpg'])

    await page.waitFor('ul.uploaded-list > li[data-key="2"].ui-draggable')

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.$eval('button.next-button:not(.back)', btnClick),
    ])

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.$eval('a#cancelButton', btnClick),
    ])

    const id = uuid()
    await page.screenshot({
      fullPage: true,
      path: `public/images/${id}.png`
    })

    await page.close()
    await browser.close()

    res
      .status(200)
      .json({
        imageUri: `${getAppUrl(req)}images/${id}.png`,
        message: 'Success'
      })
      .end()
  } catch (e) {
    console.log(e)
    res
      .status(500)
      .json({
        message: `Internal server error - ${e.message}`
      })
      .end()
  }
})

app.listen(
  PORT,
  () => {
    console.log(`Server running on port ${PORT}`)
  }
)
