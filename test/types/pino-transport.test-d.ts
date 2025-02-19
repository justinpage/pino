import { pino } from '../../pino'

// Single
const transport = pino.transport({
    target: '#pino/pretty',
    options: { some: 'options for', the: 'transport' }
})
pino(transport)

// Multiple
const transports = pino.transport({targets: [
    {
        level: 'info',
        target: '#pino/pretty',
        options: { some: 'options for', the: 'transport' }
    },
    {
        level: 'trace',
        target: '#pino/file',
        options: { destination: './test.log' }
    }
]})
pino(transports)

type TransportConfig = {
    id: string
}

// Custom transport params
const customTransport = pino.transport<TransportConfig>({
    target: 'custom',
    options: { id: 'abc' }
})
pino(customTransport)

// Worker
pino.transport({
    target: 'custom',
    worker: {
        argv: ['a', 'b'],
        stdin: false,
        stderr: true,
        stdout: false,
        autoEnd: true,
    },
    options: { id: 'abc' }
})
