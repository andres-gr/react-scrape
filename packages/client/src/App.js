import React, {
  useCallback,
  useState
} from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'

const url = 'http://localhost:4000/'

const flexCenter = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
}

const initValues = {
  descripcion: '',
  precio: '',
}

// const delay = (time = 2000) =>  new Promise(resolve => {
//   setTimeout(() => {
//     resolve(true)
//   }, time)
// })

const App = () => {
  const [values, setValues] = useState(initValues)
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(null)

  const handleChange = useCallback(e => {
    const item = e.target
    setValues(prev => ({
      ...prev,
      [item.name]: item.value
    }))
  }, [])

  const handleSubmit = useCallback(async e => {
    setLoading(true)
    e.preventDefault()
    try {
      const result = await axios.post(url, values)
      const { data } = result
      setImage(data.imageUri)
    } catch (e) {
      console.log(e)
    }
    setLoading(false)
  }, [values])

  return (
    <div
      style={{
        ...flexCenter,
        backgroundColor: "#F2F2F2",
        height: "100vh",
        width: "100vw"
      }}
    >
      {
        image
          ? (
            <div
              style={{
                ...flexCenter,
                alignItems: 'flex-start',
                height: '100%',
                overflow: 'auto',
                width: '100%',
              }}
            >
              <img
                alt={ values.descripcion }
                src={ image }
              />
            </div>
          )
          : (
            <Card
              style={{
                height: 380,
                position: "relative",
                width: "40%"
              }}
            >
              {
                loading && (
                  <div
                    style={{
                      ...flexCenter,
                      backgroundColor: "rgba(255, 255, 255, 0.6)",
                      height: "100%",
                      left: 0,
                      position: "absolute",
                      top: 0,
                      width: "100%",
                      zIndex: 999
                    }}
                  >
                    <CircularProgress size={80} />
                  </div>
                )
              }
              <CardHeader title="Semi Nuevos" />
              <form
                style={{
                  display: "flex",
                  flexFlow: "column",
                  justifyContent: "space-around"
                }}
                onSubmit={handleSubmit}
              >
                <CardContent
                  style={{
                    display: "flex",
                    flexFlow: "column",
                    justifyContent: "space-around",
                    height: 200
                  }}
                >
                  <TextField
                    fullWidth
                    required
                    disabled={ loading }
                    id="precio"
                    label="Precio"
                    name="precio"
                    type="number"
                    value={ values.precio }
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    multiline
                    required
                    disabled={ loading }
                    id="descripcion"
                    label="Descripcion"
                    name="descripcion"
                    rows="4"
                    value={ values.descripcion }
                    onChange={handleChange}
                  />
                </CardContent>
                <CardActions>
                  <Button
                    color="primary"
                    disabled={ loading }
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Subir
                  </Button>
                </CardActions>
              </form>
            </Card>
          )
      }
    </div>
  )
}

export default App
