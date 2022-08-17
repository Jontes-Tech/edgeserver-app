import { Button } from '@components/Button';
import { CreateDeleteAppModal } from '@components/CreateDeleteAppModal/CreateDeleteAppModal';
import { NoDeployments } from '@components/NoDeployments/NoDeployments';
import { ReRender } from '@components/ReRender';
import { Tab, Tabs } from '@components/Tabs/Tabs';
import { useApp } from '@utils/queries/useApp';
import { ApplicationListData } from '@utils/queries/useApps';
import { useDeployments } from '@utils/queries/useDeployments';
import { useJWT } from '@utils/useAuth';
import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { DeploymentLink } from './deployments';

const DeleteButton: FC<{ app: ApplicationListData }> = ({ app }) => {
    const { token } = useJWT();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    return (
        <div id="funnydivname">
            <Button
                onClick={() => setDeleteModalOpen(true)}
                label="DELETE"
                variant="delete"
            ></Button>
            {deleteModalOpen && (
                <CreateDeleteAppModal
                    app={app}
                    onClose={() => setDeleteModalOpen(false)}
                />
            )}
        </div>
    );
};

export const AppPage: FC = () => {
    const app = useApp();

    if (app.favicon_url)
        document
            .querySelector('#favicon')
            ?.setAttribute('href', app.favicon_url);

    useEffect(() => {
        return () => {
            document
                .querySelector('#favicon')
                // @ts-ignore
                ?.setAttribute('href', window.OG_FAVICON);
        };
    }, [0]);

    return (
        <div className="containerd pt-8 flex flex-col gap-4">
            <link rel="shortcut icon" href={app.favicon_url} />
            <div className="flex">
                <h2 className="text-2xl flex-grow block">{app.name}</h2>
            </div>
            <Tabs
                labels={[
                    '🔧 Setup',
                    '🔎 Information',
                    '🐛 Debug',
                    '⚙️ Settings',
                ]}
                defaultTab={app.last_deploy ? 1 : 0}
            >
                <Tab>
                    <NoDeployments app_id={app.app_id} />
                </Tab>
                <Tab>Welcome to your Application</Tab>
                <Tab>
                    Please ignore the following debug information <br />
                    App ID: {app.app_id}
                    <br />
                    Owner: {app.owner_id}
                    <br />
                    Domain: {app.domain_id}
                    <br />
                    <div>
                        <ReRender app_id={app.app_id} />
                    </div>
                </Tab>
                <Tab>
                    Welcome to the settings! <br />
                    <div className="bg-red-500 rounded-md w-fit mt-4 bg-opacity-10 text-black dark:text-white p-4">
                        <h2>⚠️ Danger Zone!</h2>
                        <h3>
                            Delete Application
                            <DeleteButton app={app} />
                        </h3>
                    </div>
                </Tab>
            </Tabs>

            {app.last_deploy && <AppDeploymentList app={app} />}
        </div>
    );
};

const AppDeploymentList: FC<{ app: ApplicationListData }> = ({ app }) => {
    const { deployments, error, loading } = useDeployments(app.app_id, 3);

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex justify-between">
                <h2 className="text-2xl">Recent Deployments</h2>
                <Link to={`/app/${app.app_id}/deployments`}>
                    <Button label={'Deployments ➜'} />
                </Link>
            </div>
            {loading &&
                Array.from({ length: 3 }).map((_, index) => (
                    <div className="p-4 skeleton card flex h-32" key={index} />
                ))}
            {!loading &&
                deployments &&
                deployments.length > 0 &&
                deployments.map((deployment, index) => (
                    <DeploymentLink
                        app_id={app.app_id}
                        deployment={deployment}
                        key={index}
                    />
                ))}
        </div>
    );
};
