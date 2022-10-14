export const getTrips = (req, res) => {
  return res
    .send({
      user: req.user,
      trips: [
        { id: 1, name: 'Trip 1' },
        { id: 2, name: 'Trip 2' },
      ],
    })
    .status(200);
};

export const getTrip = (_req, res) => {
  res.send({ id: 1, name: 'Trip 1' }).status(200);
};
