const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());
const port = 3000;
/*
app.get('/', (req, res) => {
  //below line is the code to send response to the server
  //res.status(200).send('helllo from the server'); //we can also send back the status code
  //we can also send the json here
  res.status(200).json({ message: 'hello from the server', app: 'natours' });
});
app.post('/', (req, res) => {
  res.send('You can not post to this endpoint');
});
*/

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      // tours: tours, //this is a resource that is declared above const tours
      //the aboveline can be written as
      tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1; //when a string looks like a number and we want to convert them to number then we simply multiply them by 1.
  //line 1st galot
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID request',
    });
  }

  const tour = tours.find((el) => {
    return el.id === id; // have to use return keyword else write in oneline of arrow function to return that oneline of code.
  });
  //refer line first galot For alternate solution below is the beter version to return an error message with s
  //status code that the requested id doesn't exist

  //INCASE ANY ID IS NOT FOUND THEN

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID request(alternate solution)',
    });
  } // this wont execute unless line galot 1 is not commented out

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
    // results: tours.length,
    // data: {
    //   // tours: tours, //this is a resource that is declared above const tours
    //   //the aboveline can be written as
    //   tours,
    // },
  });
});

app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body);
  //NOW TO ADD THE NEWLY CREATED OBJECT INTO THE PRECIOUS JSON FILE
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours) /**we need to stringify this as this is a js object
     and this is the 2nd argument which means the data which we want to write */,
    (error) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
  // res.send('done');// had to remove as you cant send two responses
});

app.patch('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid id ',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tours here....',
    },
  });
});

app.delete('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid id ',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null, //here we dont send any data
  });
});

app.listen(port, () => {
  console.log(`App running in the background ${port}`);
});
