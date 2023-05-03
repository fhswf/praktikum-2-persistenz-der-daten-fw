import express from 'express';
import DB from './db.js'


const PORT = process.env.PORT || 3000;
import bodyParser from 'body-parser';



/** Zentrales Objekt für unsere Express-Applikation */
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/** global instance of our database */
let db = new DB();

/** Initialize database connection */
async function initDB() {
    await db.connect();
    console.log("Connected to database");
}

// implement API routes

/** Return all todos. 
 *  Be aware that the db methods return promises, so we need to use either `await` or `then` here! 
 */
app.get('/todos', async (req, res) => {
    let todos = await db.queryAll();
    res.send(todos);
});

app.get('/todos/:id', async (req, res) => {
    let todos = await db.queryById(req.params.id);
    res.send(todos);
});

app.post('/todos', async (req, res) => {
    let post = {
        "title" : req.body.title,
        "due" : req.body.due,
        "status" : req.body.status
    }
    let todos = await db.insert(post);
    res.send(todos);
});

app.put('/todos/:id', async (req, res) => {
    let id = req.params.id;
    const update = {};
    if (req.body.title) {
        update.title = req.body.title;
    }
    if (req.body.due) {
        update.due = req.body.due;
    }
    if (req.body.status) {
        update.status = req.body.status;
    }
    const result = await db.update(id, update);
    let todos = await db.queryById(id);
    res.send(todos);
});

app.delete('/todos/:id', async (req, res) => {
    let todos = await db.delete(req.params.id);
    res.send(todos);
});


initDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        })
    })

