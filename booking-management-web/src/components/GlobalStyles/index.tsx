import './GlobalStyles.scss';

type GlobalStylesProps = {
    children: React.ReactNode;
};

function GlobalStyles({ children } : GlobalStylesProps) {
    return <>{children}</>;
}

export default GlobalStyles;
