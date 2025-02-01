export function Banner({
    message,
    mappings,
    customization,
    canRemoveBranding,
}: {
    canRemoveBranding: boolean;
    message: string;
    mappings: {
        coupon: string;
        country: string;
        discount: string;
    };
    customization: {
        backgroundColor: string;
        textColor: string;
        fontSize: string;
        isSticky: boolean;
        classPrefix?: string | null;
    };
}) {
    const prefix = customization.classPrefix ?? '';
    const meppingMessage = Object.entries(mappings).reduce((acc, [key, value]) => {
        return acc.replace(new RegExp(`{${key}}`, 'g'), value);
    }, message.replace(/'/g, '&apos;'));

    return (
        <>
            <style type="text/css">
                {`
                .${prefix}easy-ppp-container {
                    all: revert;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5em;
                    background-color: ${customization.backgroundColor};
                    color: ${customization.textColor};
                    font-size: ${customization.fontSize};
                    font-family: inherit;
                    padding: 1rem;
                    ${customization.isSticky ? 'position: sticky;' : ''}
                    left: 0;
                    right: 0;
                    top: 0;
                    text-wrap: balance;
                    text-align: center;
                }

                .${prefix}easy-ppp-branding {
                    color: inherit;
                    font-size: inherit;
                    display: inline-block;
                    text-decoration: underline;
                }
            `}
            </style>
            <div className={`${prefix}easy-ppp-container ${prefix}easy-ppp-override`}>
                <span
                    className={`${prefix}easy-ppp-message ${prefix}easy-ppp-override`}
                    dangerouslySetInnerHTML={{ __html: meppingMessage }}
                />
                {!canRemoveBranding && (
                    <a
                        className={`${prefix}easy-ppp-branding`}
                        href={`${process.env.NEXT_PUBLIC_APP_URL}`}
                    >   
                        Powered by Easy app
                    </a>
                )}
            </div>
        </>
    );
}