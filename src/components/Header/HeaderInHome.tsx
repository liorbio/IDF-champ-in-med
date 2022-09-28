import { useState } from 'react';
import ReactDOM from 'react-dom';
import classes from './Header.module.css';
import { portalElement } from '../../elements/portalElement';
import ModalBackgroundClicksPrevention from '../UI/ModalBackgroundClicksPrevention';
import UploadScoresModal from '../UI/UploadScoresModal';

const HeaderInHome = () => {
    const [showUploadModal, setShowUploadModal] = useState(false);
    
    return (
        <div className={classes.headerWrapper} style={{ backgroundColor: "#fff" }}>
            <div style={{ gridArea: "3 / 1" }}><img src="/ChampionshipLogoLior.jpg" alt="Championship logo" style={{ marginRight: "16vw" }} /></div>  
            {showUploadModal && ReactDOM.createPortal(<ModalBackgroundClicksPrevention top={0} handler={() => setShowUploadModal(false)} />, portalElement)}
            {showUploadModal && ReactDOM.createPortal(<UploadScoresModal />, portalElement)}
            <div style={{ gridArea: "3 / 3", fontSize: "2.5rem" }} onClick={() => setShowUploadModal(true)}>&#x2261;&#xFE0E;</div>
            
        </div>
    );
};

export default HeaderInHome;