const axios = require('axios');
const eventModel = require('./eventModel');
const eventController = require('./eventController');

// Mocking Axios
jest.mock('axios');

// Mocking eventModel functions
jest.mock('./eventModel', () => ({
    createEvent: jest.fn(),
    deleteEventModel: jest.fn(),
    checkIfCreator: jest.fn(),
    getEvents: jest.fn()
  }));

  describe('Event Controller Tests', () => {
    test('dummy test', () => {
      expect(true).toBe(true);
    });
  });


  describe('Event Controller Tests', () => {
    let req, res;
  
    beforeEach(() => {
      req = { session: { user: { username: 'testUser', identifier: '123' } } };
      res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
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
  
      eventModel.createEvent.mockResolvedValue({ eventId: 'abc123' });
  
      await eventController.createEvent(req, res);
  
      expect(eventModel.createEvent).toHaveBeenCalledWith(
        'Meeting',
        '2025-02-25',
        '10:00',
        '12:00',
        'Room A',
        'Team meeting',
        'blue',
        false,
        'public',
        [{ username: 'john_doe', identifier: '456' }],
        { username: 'testUser', identifier: '123' }
      );
  
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({ result: { eventId: 'abc123' } });
    });
  });