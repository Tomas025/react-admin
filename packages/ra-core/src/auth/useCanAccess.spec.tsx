import * as React from 'react';
import expect from 'expect';
import { waitFor, render, screen } from '@testing-library/react';

import { QueryClient } from '@tanstack/react-query';
import { Basic } from './useCanAccess.stories';

describe('useCanAccess', () => {
    it('should allow access on mount when there is no authProvider', () => {
        render(<Basic authProvider={null} />);
        expect(screen.queryByText('LOADING')).toBeNull();
        screen.getByText('canAccess: YES');
    });

    it('should return that the resource is accessible when canAccess return true', async () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
            canAccess: () => Promise.resolve(true),
        };
        render(<Basic authProvider={authProvider} />);
        await waitFor(() => {
            expect(screen.queryByText('LOADING')).toBeNull();
            expect(screen.queryByText('canAccess: YES')).not.toBeNull();
        });
    });

    it('should return that the resource is accessible when auth provider does not have an canAccess method', async () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
            canAccess: undefined,
        };
        render(<Basic authProvider={authProvider} />);

        await waitFor(() => {
            expect(screen.queryByText('LOADING')).toBeNull();
            expect(screen.queryByText('canAccess: YES')).not.toBeNull();
        });
    });

    it('should return that the resource is not accessible when canAccess return false', async () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
            canAccess: () => Promise.resolve(false),
        };
        render(<Basic authProvider={authProvider} />);

        await waitFor(() => {
            expect(screen.queryByText('LOADING')).toBeNull();
            expect(screen.queryByText('canAccess: NO')).not.toBeNull();
            expect(screen.queryByText('ERROR')).toBeNull();
        });
    });

    it('should return an error after a tick if the auth.canAccess call fails and checkError resolves', async () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
            checkError: () => Promise.resolve(),
            canAccess: () => Promise.reject('not good'),
        };
        render(<Basic authProvider={authProvider} />);

        await waitFor(() => {
            expect(screen.queryByText('LOADING')).toBeNull();
        });
        await waitFor(() => {
            expect(screen.queryByText('ERROR')).not.toBeNull();
        });
    });

    it('should abort the request if the query is canceled', async () => {
        const abort = jest.fn();
        const authProvider = {
            canAccess: jest.fn(
                ({ signal }) =>
                    new Promise(() => {
                        signal.addEventListener('abort', () => {
                            abort(signal.reason);
                        });
                    })
            ) as any,
            checkError: () => Promise.resolve(),
            supportAbortSignal: true,
        } as any;
        const queryClient = new QueryClient();
        render(<Basic authProvider={authProvider} queryClient={queryClient} />);
        await waitFor(() => {
            expect(authProvider.canAccess).toHaveBeenCalled();
        });
        queryClient.cancelQueries({
            queryKey: ['auth', 'canAccess'],
        });
        await waitFor(() => {
            expect(abort).toHaveBeenCalled();
        });
    });
});
