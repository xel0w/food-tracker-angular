const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/user');
const FoodEntry = require('./models/foodEntry');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const app = express();

app.use(bodyParser.json());
app.use(cors());

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Xel0w:Test1234@cluster0.1yteva8.mongodb.net/food-tracking-2', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connexion à la base de données MongoDB établie avec succès.');
})
.catch(error => {
  console.error('Erreur lors de la connexion à la base de données MongoDB :', error);
});
// Route de connexion
app.post('/api/login', (req, res) => {
    const { pseudo, password } = req.body;
    console.log(pseudo, password);
    User.findOne({ pseudo })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Pseudo incorrect.' });
        }
        bcrypt.compare(password, user.password)
          .then(match => {
            if (match) {
              const token = jwt.sign({ userId: user._id, pseudo: user.pseudo, isAdmin: user.isAdmin }, 'mns2023', { expiresIn: '1h' });
              res.json({ token });
            } else {
              res.status(401).json({ error: 'Pseudo ou mot de passe incorrect.' });
            }
          })
          .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Une erreur s\'est produite lors de la connexion.' });
          });
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ error: 'Une erreur s\'est produite lors de la connexion.' });
      });
  });

  // Route d'inscription
app.post('/api/register', (req, res) => {
  const { pseudo, password } = req.body;
  console.log(pseudo,password);
  
  User.findOne({ pseudo })
    .then(existingUser => {
      if (existingUser) {
        return res.status(400).json({ error: 'Ce pseudo est déjà utilisé. Veuillez en choisir un autre.' });
      }
      
      bcrypt.hash(password, 10)
        .then(hashedPassword => {
          const user = new User({
            pseudo,
            password: hashedPassword
          });
          
          user.save()
            .then(savedUser => {
              res.json({ message: 'Inscription réussie.' });
            })
            .catch(error => {
              console.error(error);
              res.status(500).json({ error: 'Une erreur s\'est produite lors de l\'enregistrement de l\'utilisateur.' });
            });
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ error: 'Une erreur s\'est produite lors de la création du mot de passe.' });
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Une erreur s\'est produite lors de la vérification de l\'existence de l\'utilisateur.' });
    });
});

// Données de suivi de nourriture
let foodEntries = [];

app.post('/api/food', (req, res) => {
    const { nom, description, calories, type, id, date, pseudo } = req.body;
  
    // Créer une nouvelle entrée alimentaire
    const foodEntry = new FoodEntry({
      nom,
      description,
      calories,
      type,
      userId: id,
      date,
      pseudo
    });
  
    // Enregistrer l'entrée alimentaire dans la base de données
    foodEntry.save()
      .then(savedFoodEntry => {
        res.json(savedFoodEntry);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ error: 'Une erreur s\'est produite lors de l\'enregistrement de l\'entrée alimentaire.' });
      });
  });


  app.get('/api/food-entries', (req, res) => {
    FoodEntry.find()
      .then(entries => {
        res.json(entries);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des entrées alimentaires.' });
      });
  });

  app.get('/api/food-entries/:id', (req, res) => {
    const id = req.params.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Réinitialise les heures, minutes, secondes et millisecondes à 0
  
    FoodEntry.find({ userId: id, date: { $gte: today } })
      .then(entries => {
        res.json(entries);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des entrées alimentaires.' });
      });
  });
  
  
  
  
  // Supprimer une entrée de nourriture spécifique
  app.delete('/api/food-entries/:id', (req, res) => {
    const entryId = req.params.id;
    FoodEntry.findByIdAndDelete(entryId)
      .then(() => {
        res.json({ message: 'Entrée supprimée avec succès.' });
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ error: 'Une erreur s\'est produite lors de la suppression de l\'entrée alimentaire.' });
      });
  });
  
  // Démarrer le serveur
  const port = 3000;
  app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
  });