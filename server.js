const fastify = require('fastify')({ logger: true })
const config = require('./config')

const io = require('fastify-socket.io')

fastify.register(io)

fastify.register(require('@fastify/static'), {
    root: require('path').join(__dirname, 'public'),
    prefix: '/',
})

fastify.ready(err => {
    if (err) throw err

    fastify.io.on('connection', socket => {
        console.log('Nuevo cliente conectado.')
        socket.emit('mensaje', 'Bienvenido')

        let contador = 1

        setInterval(() => {
            socket.emit('mensaje', `Hola, saludos a todos --> ${contador}`)
            contador++
        }, 5000)
    })
})

fastify.listen({ port: config.PORT }, (err, address) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    console.log(`La aplicación está escuchando en ${address}`)
})

