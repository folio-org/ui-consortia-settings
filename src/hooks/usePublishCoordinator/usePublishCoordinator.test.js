import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import {
  pcPostRequest,
  pcPublicationDetails,
  pcPublicationResults,
} from 'fixtures';
import { PUBLISH_COORDINATOR_STATUSES } from '../../constants';
import { usePublishCoordinator } from './usePublishCoordinator';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const kyMock = {
  get: jest.fn(),
  post: jest.fn(),
};

const publicationResults = pcPublicationResults.publicationResults.map(({ response, ...rest }) => ({
  response: JSON.parse(response),
  ...rest,
}));
const response = {
  publicationResults,
  totalRecords: pcPublicationResults.totalRecords,
};

const getDetailsMock = jest.fn((status) => Promise.resolve({ ...pcPublicationDetails, status }));
const getResultsMock = jest.fn(() => Promise.resolve(pcPublicationResults));

const getMockedImplementation = (status = PUBLISH_COORDINATOR_STATUSES.COMPLETE) => (url) => ({
  json: () => Promise.resolve(url.endsWith('/results') ? getResultsMock() : getDetailsMock(status)),
});

describe('usePublishCoordinator.test', () => {
  beforeEach(() => {
    getDetailsMock.mockClear();
    getResultsMock.mockClear();
    kyMock.get.mockClear().mockImplementation(getMockedImplementation());
    kyMock.post.mockClear().mockImplementation(() => ({
      json: () => Promise.resolve(pcPublicationDetails),
    }));
    useOkapiKy.mockClear().mockReturnValue(kyMock);
  });

  it('should initiate publish coordinator request to get records from provided tenants', async () => {
    const { result } = renderHook(() => usePublishCoordinator(), { wrapper });

    const { initPublicationRequest } = result.current;

    expect(await initPublicationRequest({
      ...pcPostRequest,
      url: pcPostRequest.url.slice(1),
    })).toEqual(response);
    expect(kyMock.post).toHaveBeenCalled();
  });

  it('should poll publish coordinator until the publication status is \'In progress\'', async () => {
    kyMock.get
      .mockClear()
      .mockImplementationOnce(getMockedImplementation(PUBLISH_COORDINATOR_STATUSES.IN_PROGRESS))
      .mockImplementationOnce(getMockedImplementation(PUBLISH_COORDINATOR_STATUSES.IN_PROGRESS))
      .mockImplementation(getMockedImplementation(PUBLISH_COORDINATOR_STATUSES.COMPLETE));

    const { result } = renderHook(() => usePublishCoordinator(), { wrapper });

    const { initPublicationRequest } = result.current;

    expect(await initPublicationRequest(pcPostRequest)).toEqual(response);
    expect(getDetailsMock).toHaveBeenCalledTimes(3);
    expect(getResultsMock).toHaveBeenCalledTimes(1);
  }, 10_000);
});
