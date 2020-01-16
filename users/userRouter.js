const express = require('express');

const User = require('./userDb.js');
const Posts = require('../posts/postDb')
const router = express.Router();

router.post('/', validateUser, (req, res) => {
  // do your magic
  // const userData = req.body;
  
  // if(userData.name)
  // {
  //   if(typeof userData.name == "string")
  //   {
  //     User.insert(userData)
  //     .then( userName => {
  //       console.log(userName);
  //       res.status(201).json(userName);
  //     })
  //     .catch( error => {
  //       console.log(error)
  //       res.status(500).json({
  //         error: "There was an error adding the user"
  //       })
  //     })
  //   }
  //   else {
  //     res.status(400).json({
  //       error: "Please enter a string for the name."
  //     })
  //   }
    
  // } else {
  //   res.status(400).json({
  //     error: "Please give the user a name."
  //   })
  // }
  
  
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  const id = req.params.id;
  const data = req.body;

  // User.getById(id)
  // if(id){
  //   console.log(data.user_id, typeof data.user_id);
  //   console.log(data.text, typeof data.text);

  //   if(data.text && typeof data.text == "string" && data.user_id && typeof data.user_id == "number" )
  //   {
  //     Posts.insert(data)
  //     .then( post => {
  //       console.log(post);
  //       res.status(201).json(post)
  //     })
  //     .catch( error => {
  //       console.log(error);
  //       res.status(500).json({
  //         error: "There was an error adding this post"
  //       })
  //     })
  //   } else {
  //     res.status(400).json({
  //       error: "Missing post text or user ID. Please try again."
  //     })
  //   }

  // } else {
  //   res.status(404).json({
  //     error: "The specified ID was not found"
  //   })
  // }
});

router.get('/', (req, res) => {
  // do your magic!
  User.get(req.query)
  .then( users => {
    res.status(200).json(users)
  })
  .catch( error => {
    res.status(400).json({
      error: "Error loading users"
    })
  })

  
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  const id = req.params.id
  User.getById(id)
  
  .then( user => {
    if(user){
      res.status(200).json(user);
    } else {
      res.status(404).json({
        error: "User not found"
      })
    }
  })
  .catch( error => {
    console.log(error);
    res.status(500).json({
      error: "The user's information could not be loaded"
    })
  })
});

router.get('/:id/posts', validateUserId,   (req, res) => {
  // do your magic!
  const id = req.params.id;
  Posts.getById(id)
  .then( post => {
    if(post){
      res.status(200).json(post);
    } else {
      res.status(404).json({
        error: "The ID could not be found for the post"
      })
    }
  })
  .catch(error=> {
    console.log(error);
    res.status(500).json({
      error: "The post could not be found"
    })
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  const id = req.params.id;

  User.remove(id)
  .then(deleted => {
    if(deleted){
      console.log('User deleted:', deleted)
      res.status(200).json(deleted);
    } else {
      res.status(404).json({
        error: "User not found"
      })
    }
  })
  .catch( error => {
     console.log(error);
     res.status(500).json({
       error: "The user could not be deleted"
     })
  })
});

router.put('/:id', validateUserId, (req, res) => {
  // do your magic!
  const id = req.params.id;
  const data = req.body;

  User.update(id, data)
  .then( update => {
    if(update){
      if(data.name && typeof data.name =="string"){
        res.status(200).json(update)
      } else {
        res.status(400).json({
          error: "Please change the name"
        })
      }

    } else {
      res.status(404).json({
        error: "The user could not be found"
      })
    }
  })
  .catch( error => {
    console.log(error);
    res.status(500).json({
      error: "The user could not be modified"
    })
  })

});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const id = req.params.id;
  User.getById(id)
  .then(verify =>{
    if(verify){
      req.user = id;
      next();
    } else {
      res.status(404).json({
        error: "Invalid User Id --- ValidateUserID"
      })
    }
  })
  
}

router.use(validateUserId);

function validateUser(req, res, next) {
  // do your magic!

  const data = req.body;
  if(data.name){
    if(typeof data.name == "string"){
      User.insert(data)
      .then( userName => {
        console.log("passes middleware user validation")
        res.status(201).json(userName);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          error: "Error validating user"
        })
      })
    } else {
        res.status(400).json({
          error: "Missing User Data ----- UserValidation MW"
        })
    }
  } else {
    res.status(400).json({
      error: "Please enter string name ---- Validate User MW"
    })
  }
}

router.use(validateUser)

function validatePost(req, res, next) {
  // do your magic!
  const post = req.body;
  if(post){
    if(post.text && post.user_id && typeof post.text == "string" && typeof post.user_id == "number"){

      Posts.insert(post)
      .then( data => {
        console.log('Post validated by MW')
        res.status(201).json(data);
        next();
      })
      .catch( error => {
        res.status(500).json({
          error: "Error adding post ----- ValidatePost MW"
        })
      })
    } else {
      res.status(400).json({
        error: "Missing Required Text Field --- ValidatePost MW"
      })
    }

  } else {
    res.status(400).json({
      error: "Missing Post Data --- ValidatePost MW"
    })
  }
}

router.use(validatePost);

module.exports = router;
