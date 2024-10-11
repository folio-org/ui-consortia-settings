import { mergeAndGetUniqueById } from './utils';

describe('mergeAndGetUniqueById', () => {
  it('should merge two input objects and return unique items by id', () => {
    const inputObject1 = {
      data: [
        {
          id: '1',
          applicationId: 'app1',
          resource: 'Resource 1',
          actions: { view: 'action1' },
        },
        {
          id: '2',
          applicationId: 'app1',
          resource: 'Resource 2',
          actions: { view: 'action2' },
        },
      ],
      procedural: [],
      settings: [],
    };

    const inputObject2 = {
      data: [
        {
          id: '2',
          applicationId: 'app2',
          resource: 'Resource 2',
          actions: { view: 'action2' },
        },
        {
          id: '3',
          applicationId: 'app2',
          resource: 'Resource 3',
          actions: { view: 'action3' },
        },
      ],
      procedural: [],
      settings: [],
    };

    const expectedOutput = {
      data: [
        {
          id: '1',
          applicationId: 'app1',
          resource: 'Resource 1',
          actions: { view: 'action1' },
        },
        {
          id: '2',
          applicationId: 'app1',
          resource: 'Resource 2',
          actions: { view: 'action2' },
        },
        {
          id: '3',
          applicationId: 'app2',
          resource: 'Resource 3',
          actions: { view: 'action3' },
        },
      ],
      procedural: [],
      settings: [],
    };

    const result = mergeAndGetUniqueById(inputObject1, inputObject2);

    expect(result).toEqual(expectedOutput);
  });

  it('should return an empty object if both inputs are empty', () => {
    const inputObject1 = {
      data: [],
      procedural: [],
      settings: [],
    };

    const inputObject2 = {
      data: [],
      procedural: [],
      settings: [],
    };

    const expectedOutput = {
      data: [],
      procedural: [],
      settings: [],
    };

    const result = mergeAndGetUniqueById(inputObject1, inputObject2);

    expect(result).toEqual(expectedOutput);
  });
});
