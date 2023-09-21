import { BondCard } from '../features/bond-card/ui';
import { createDataset } from '../features/bond-card/db/bonds-factory';
import { useEffect, useState } from 'react';
import {
    Affix,
    AppShell,
    Burger, Button,
    Group,
    NavLink, rem,
    Title, Transition,
} from '@mantine/core';
import { useDisclosure, useWindowScroll } from '@mantine/hooks';
import { IconArrowUp } from '@tabler/icons-react';
import { BondCachePage } from '../features/bonds-cache/ui';


const pages = [
    {
        name: 'Bond Card',
        description: 'Карточка облигации',
    },
    {
        name: 'Bond Cache',
        description: 'Кэш данных об облигациях',
    },
    {
        name: 'Shared Construction',
        description: 'Долевое строительство',
    },
];

function App() {
    const [pending, setPending] = useState(false);
    const [updatedAt, update] = useState(Date.now());

    let _pageName;
    try {
        _pageName = localStorage.getItem('bonds-page-name');
    } catch (e) {
        console.error(e);
    }
    const [pageName, setPageName] = useState(_pageName ?? pages[0].name);

    const [scroll, scrollTo] = useWindowScroll();
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

    useEffect(() => {
        try {
            localStorage.setItem('bonds-page-name', pageName);
        } catch (e) {
            console.error(e);
        }
    }, [pageName]);

    let page;
    switch (pageName) {
        case 'Bond Card':
            page = <BondCard updatedAt={updatedAt}/>;
            break;
        case 'Bond Cache':
            page = <BondCachePage/>;
            break;
        case 'Shared Construction':
            break;
        default:
            page = <BondCard updatedAt={updatedAt}/>;
    }

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: {
                    mobile: !mobileOpened,
                    desktop: !desktopOpened,
                },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between" align="center">
                    <Group>
                        <Burger opened={mobileOpened}
                                onClick={toggleMobile}
                                hiddenFrom="sm"
                                size="sm"
                        />
                        <Burger opened={desktopOpened}
                                onClick={toggleDesktop}
                                visibleFrom="sm"
                                size="sm"
                        />
                        <Title>{pageName}</Title>
                    </Group>
                    <Button
                        loading={pending}
                        onClick={async () => {
                            if (pending) return;
                            setPending(true);
                            setTimeout(async () => {
                                const time = await createDataset(true);
                                update(time);
                                setPending(false);
                            }, 150);
                        }}
                    >
                        New dataset
                    </Button>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                Pages
                {pages.map((item, index) => (
                    <NavLink key={item.name}
                             label={item.name}
                             description={item.description}
                             active={pageName === item.name}
                             onClick={() => setPageName(item.name)}
                    />
                ))}
            </AppShell.Navbar>
            <AppShell.Main>
                {page}
            </AppShell.Main>

            <Affix position={{
                bottom: 20,
                right: 20,
            }}
            >
                <Transition transition="slide-up" mounted={scroll.y > 0}>
                    {(transitionStyles) => (
                        <Button
                            leftSection={<IconArrowUp style={{
                                width: rem(16),
                                height: rem(16),
                            }}
                            />}
                            style={transitionStyles}
                            onClick={() => scrollTo({ y: 0 })}
                        >
                            Scroll to top
                        </Button>
                    )}
                </Transition>
            </Affix>
        </AppShell>
    );
}

export default App;
