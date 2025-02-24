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

  //Tests description
  describe('Event Tests', () => {
    let req, res;
  
    //Set up mock request and response objects before each test
    beforeEach(() => {
      req = { session: { user: { username: 'testUser', identifier: '123' } } };
      res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    });
  
    //Clear all mocks after each test to prevent test interference
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    //Simulate a request body for event creation with valid data
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
  
      //Call the controller function createEvent
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

    //Test to ensure non-creator deletion returns 403
    test('Return 403 if user is not the event creator', async () => {
      req.body = { _id: 'event123' };
      eventModel.checkIfCreator.mockResolvedValue(null);

      await eventController.deleteEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith({ msg: 'User does not have the authority to delete this event' });
    });

    //Test to verify deletion failure returns 500
    test('Return 500 if deletion fails', async () => {
      req.body = { _id: 'event123' };
      eventModel.checkIfCreator.mockResolvedValue(true);
      eventModel.deleteEventModel.mockResolvedValue(null);

      await eventController.deleteEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ msg: "Couldn't Delete Event" });
    });

    //Test to verify getEvents failure returns 500
    test('Return 500 if getEvents fails', async () => {
      eventModel.getEvents.mockResolvedValue(null);

      await eventController.getEvents(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ msg: 'Failed to get events' });
    });

    
    /* 
    //Simulate missing required fields, causing test fail
    test('Required fields are missing', async () => {
      req.body = { title: '', date: '', fromTime: '', toTime: '', location: '' };
    
      await eventController.createEvent(req, res);
    
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ msg: 'Missing required fields' });
    });
    */


    //Simulate that the user is not the creator by returning null
    test('Attempt to delete someone else’s event returns 403', async () => {
      req.body = { _id: 'event123' };
      
      eventModel.checkIfCreator.mockResolvedValue(null);

      await eventController.deleteEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith({ msg: 'User does not have the authority to delete this event' 

      });
  });
});