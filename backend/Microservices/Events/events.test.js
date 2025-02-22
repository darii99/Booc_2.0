const axios = require('axios');
const eventModel = require('./eventModel');
const eventController = require('./eventController');

//Mocking Axios
jest.mock('axios');

//Mocking eventModel functions
jest.mock('./eventModel', () => ({
    createEvent: jest.fn(),
    deleteEventModel: jest.fn(),
    checkIfCreator: jest.fn(),
    getEvents: jest.fn()
  }));

 
  describe('Event Controller Tests', () => {
    let req, res;
  
    beforeEach(() => {
      req = { session: { user: { username: 'testUser', identifier: '123' } } };
      res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    //Simulate a request body for event creation
    test('Creating an event successfully', async () => {
      req.body = {
        title: 'Meeting',
        date: '2025-03-25',
        fromTime: '10:00',
        toTime: '12:00',
        location: 'Room A',
        description: 'Test meeting',
        color: 'blue',
        repeat: false,
        visibility: 'public',
        invitePeople: [['john_doe', '456']]
      };
  
      //Mock the createEvent function to return a dummy event ID
      eventModel.createEvent.mockResolvedValue({ eventId: 'abc123' });
  
      //Call the controller function
      await eventController.createEvent(req, res);
  
      //Verify that createEvent was called with correct parameters
      expect(eventModel.createEvent).toHaveBeenCalledWith(
        'Meeting',
        '2025-03-25',
        '10:00',
        '12:00',
        'Room A',
        'Test meeting',
        'blue',
        false,
        'public',
        [{ username: 'john_doe', identifier: '456' }],
        { username: 'testUser', identifier: '123' }
      );
  
      //Expect a successful response
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({ result: { eventId: 'abc123' } });
    });

  test('should return 403 if user is not the event creator', async () => {
    req.body = { _id: 'event123' };
    eventModel.checkIfCreator.mockResolvedValue(null);

    await eventController.deleteEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({ msg: 'User does not have the authority to delete this event' });
  });

  test('should return 500 if deletion fails', async () => {
    req.body = { _id: 'event123' };
    eventModel.checkIfCreator.mockResolvedValue(true);
    eventModel.deleteEventModel.mockResolvedValue(null);

    await eventController.deleteEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({ msg: "Couldn't Delete Event" });
  });

  test('should return 500 if getEvents fails', async () => {
    eventModel.getEvents.mockResolvedValue(null);

    await eventController.getEvents(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({ msg: 'Failed to get events' });
  });

  //Simulate missing required fields, causing test fail
  test('Required fields are missing', async () => {
    req.body = { title: '', date: '', fromTime: '', toTime: '', location: '' };
  
    await eventController.createEvent(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ msg: 'Missing required fields' });
  });

  //Simulate unauthorized event deletion, causing test fail
  test('Attempt to delete someone else’s event', async () => {
    req.body = { _id: 'event123' };
    eventModel.checkIfCreator.mockResolvedValue(false); // Not the creator
  
    await eventController.deleteEvent(req, res);
  
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({ msg: 'User does not have the authority to delete this event' });
  });

});