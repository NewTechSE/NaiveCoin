import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS } from '@config';
import { Routes } from '@interfaces/routes.interface';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import _ from 'lodash';
import { Block } from './dtos/block.dto';
import {
  getBlockchain,
  getUnspentTxOuts,
  getMyUnspentTransactionOutputs,
  generateRawNextBlock,
  generateNextBlock,
  getAccountBalance,
  generatenextBlockWithTransaction,
  sendTransaction,
} from './dtos/blockchain.dto';
import { getTransactionPool } from './dtos/transaction-pool.dto';
import { UnspentTxOut } from './dtos/transaction.dto';
import { getPublicFromWallet, initWallet } from './dtos/wallet.dto';
import { getSockets, connectToPeers, initP2PServer } from './services/p2p.service';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();

    initP2PServer(6001);
    initWallet();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });

    this.app.get('/blocks', (req, res) => {
      res.send(getBlockchain());
    });

    this.app.get('/block/:hash', (req, res) => {
      const block = _.find(getBlockchain(), { hash: req.params.hash });
      res.send(block);
    });

    this.app.get('/transaction/:id', (req, res) => {
      const tx = _(getBlockchain())
        .map(blocks => blocks.data)
        .flatten()
        .find({ id: req.params.id });
      res.send(tx);
    });

    this.app.get('/address/:address', (req, res) => {
      const unspentTxOuts: UnspentTxOut[] = _.filter(getUnspentTxOuts(), uTxO => uTxO.address === req.params.address);
      res.send({ unspentTxOuts: unspentTxOuts });
    });

    this.app.get('/unspentTransactionOutputs', (req, res) => {
      res.send(getUnspentTxOuts());
    });

    this.app.get('/myUnspentTransactionOutputs', (req, res) => {
      res.send(getMyUnspentTransactionOutputs());
    });

    this.app.post('/mineRawBlock', (req, res) => {
      if (req.body.data == null) {
        res.send('data parameter is missing');
        return;
      }
      const newBlock: Block = generateRawNextBlock(req.body.data);
      if (newBlock === null) {
        res.status(400).send('could not generate block');
      } else {
        res.send(newBlock);
      }
    });

    this.app.post('/mineBlock', (req, res) => {
      const newBlock: Block = generateNextBlock();
      if (newBlock === null) {
        res.status(400).send('could not generate block');
      } else {
        res.send(newBlock);
      }
    });

    this.app.get('/balance', (req, res) => {
      const balance: number = getAccountBalance();
      res.send({ balance: balance });
    });

    this.app.get('/address', (req, res) => {
      const address: string = getPublicFromWallet();
      res.send({ address: address });
    });

    this.app.post('/mineTransaction', (req, res) => {
      const address = req.body.address;
      const amount = req.body.amount;
      try {
        const resp = generatenextBlockWithTransaction(address, amount);
        res.send(resp);
      } catch (e) {
        console.log(e.message);
        res.status(400).send(e.message);
      }
    });

    this.app.post('/sendTransaction', (req, res) => {
      try {
        const address = req.body.address;
        const amount = req.body.amount;

        if (address === undefined || amount === undefined) {
          throw Error('invalid address or amount');
        }
        const resp = sendTransaction(address, amount);
        res.send(resp);
      } catch (e) {
        console.log(e.message);
        res.status(400).send(e.message);
      }
    });

    this.app.get('/transactionPool', (req, res) => {
      res.send(getTransactionPool());
    });

    this.app.get('/peers', (req, res) => {
      res.send(getSockets().map((s: any) => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });
    this.app.post('/addPeer', (req, res) => {
      connectToPeers(req.body.peer);
      res.send();
    });

    this.app.post('/stop', (req, res) => {
      res.send({ msg: 'stopping server' });
      process.exit();
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
