type acceptableIcons = "Xright" | "Xleft" | ">" | "<";

const NavigatorIcon = ({ icon, handler }: { icon: acceptableIcons, handler: () => void }) => {
    return (
        <>
            {icon === 'Xright' && <h1 style={{ gridArea: "3 / 1", fontSize: "2.7rem" }} onClick={handler}>&#x2A2F;&#xFE0E;</h1>}
            {icon === 'Xleft' && <h1 style={{ gridArea: "3 / 3", fontSize: "2.7rem" }} onClick={handler}>&#x2A2F;&#xFE0E;</h1>}
            {icon === '>' && <h2 style={{ gridArea: "3 / 1" }} onClick={handler}>&#x25B6;&#xFE0E;</h2>}
            {icon === '<' && <h2 style={{ gridArea: "3 / 3" }} onClick={handler}>&#x25C0;&#xFE0E;</h2>}
        </>
    )
};

export default NavigatorIcon;


// {icon === 'Xright' && <img style={{ gridArea: "3 / 1" }} onClick={handler} src="/blackXIcon.png" alt="Quit" />}
// {icon === 'Xleft' && <img style={{ gridArea: "3 / 3" }} onClick={handler} src="/blackXIcon.png" alt="Quit" />}
// {icon === '>' && <img style={{ gridArea: "3 / 1" }} onClick={handler} src="/RightArrow.png" alt="Previous" />}
// {icon === '<' && <img style={{ gridArea: "3 / 3" }} onClick={handler} src="/LeftArrow.png" alt="Next" />}