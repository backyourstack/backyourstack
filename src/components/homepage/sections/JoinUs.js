import React, { Fragment, useState } from 'react';
import Modal from 'react-modal';
import { FaSlack, FaTwitter, FaGithub } from 'react-icons/fa';

import MouseTracker from '../MouseTracker';
import HomepageLink from '../HomepageLink';
import {
  InquiriesForm,
  BecomeBetaTesterForm,
  PartnershipForm,
  modalCustomStyle,
} from '../ContactUsForms';

const JoinUs = () => {
  const [activeTab, setActiveTab] = useState('inquiries');
  const [modalIsOpen, setIsOpen] = useState(false);
  Modal.setAppElement('#__next');

  return (
    <Fragment>
      <style jsx>
        {`
          .backgroundWrapper {
            background-color: #7a9fb8;
            background-image: url('/static/img/homepage/joinus-bg.svg');
            background-repeat: no-repeat;
            background-position: right top;
            padding-bottom: 30px;
            padding-top: 100px;
          }
          .container {
            margin-right: 18px;
            margin-left: 18px;
            padding-top: 90px;
            padding-bottom: 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .joinUsWrapper {
            box-sizing: border-box;
            width: 283px;
            min-height: 335px;
            padding: 42px 15px 35px;
            background-color: #ffffff;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 29px;
          }
          .joinUsWrapper h2 {
            font-weight: bold;
            font-size: 32px;
            line-height: 40px;
            text-align: center;
            color: #3c5869;
          }
          .actionWrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .soical-icons {
            margin-bottom: 20px;
          }
          .soical-icons a {
            margin-right: 10px;
            margin-left: 10px;
          }
          .contactUsWrapper {
            background-color: #3c5869;
            padding: 46px 37px;
            display: flex;
            justify-content: center;
            box-sizing: border-box;
            width: 288px;
            min-height: 390px;
          }
          .tabs {
            display: flex;
          }
          .tab {
            width: 95px;
            height: 48px;
            outline: none;
            border: none;
            padding: 13px 6px 19px;
            color: #3c5869;
            font-weight: bold;
            font-size: 8px;
            line-height: 16px;
            background: #ffffff;
            border-radius: 8px 8px 0px 0px;
            font-family: Fira Code;
            margin-right: 2px;
            cursor: pointer;
          }
          .tab:hover {
            font-weight: bold;
          }
          .active {
            background-color: #3c5869;
            color: #fff;
            font-weight: bold;
          }
          .soical {
            color: #3c5869;
          }
          .soical:hover {
            color: #7a9fb8;
          }
          @media screen and (min-width: 375px) {
            .tab {
              font-size: 12px;
            }
            .contactUsWrapper {
              width: 344px;
            }
          }

          @media screen and (min-width: 768px) {
            .joinUsWrapper {
              width: 441px;
              height: 488px;
            }
            .joinUsWrapper h2 {
              font-size: 56px;
              line-height: 64px;
              text-align: center;
              letter-spacing: -0.02em;
              margin-bottom: 54px;
            }
            .contribute {
              margin-bottom: 93px;
            }
            .contactUsWrapper {
              width: 600px;
            }
            .contactUsForm h3 {
              margin-bottom: 20px;
            }
            form,
            .contactUsForm {
              width: 458px;
            }
            form input {
              width: 336px;
            }
            textarea {
              width: 405px;
            }
            .sendButton {
              align-self: flex-end;
            }
            .tab {
              width: auto;
              height: auto;
              padding: 16px;
            }
          }
          @media screen and (min-width: 1194px) {
            .backgroundWrapper {
              padding-top: 140px;
            }
            .container {
              flex-direction: row;
              justify-content: center;
              align-items: flex-end;
            }
            .joinUsWrapper {
              height: 525px;
              width: 390px;
              margin-right: 10px;
              position: relative;
              top: 25px;
            }
            .tabs,
            .contactUsWrapper {
              margin-left: 30px;
            }
            .tab {
              font-weight: normal;
            }
            .active {
              background-color: #3c5869;
              color: #fff;
              font-weight: bold;
            }
          }
          @media screen and (min-width: 1440px) {
            .contactUsWrapper {
              width: 865px;
            }
            form,
            .contactUsForm {
              width: 705px;
            }
            textarea {
              width: 650px;
            }
          }
        `}
      </style>
      <div className="backgroundWrapper">
        <div className="container">
          <div className="joinUsWrapper">
            <h2>Join Us!</h2>
            <div className="actionWrapper">
              <MouseTracker
                style={{
                  display: 'flex',
                  width: '252px',
                }}
                render={mousePosition => (
                  <HomepageLink
                    className="becomeAPartner joinUsbecomeAPartner"
                    mousePosition={mousePosition}
                    onClick={e => {
                      e.preventDefault();
                      setIsOpen(true);
                    }}
                  >
                    Become a partner
                  </HomepageLink>
                )}
              />
              <MouseTracker
                style={{
                  marginBottom: '80px',
                  display: 'flex',
                  width: '252px',
                }}
                render={mousePosition => (
                  <HomepageLink
                    href="https://opencollective.com/backyourstack"
                    className="contribute joinUscontribute"
                    mousePosition={mousePosition}
                  >
                    Contribute
                  </HomepageLink>
                )}
              />
            </div>
            <div className="soical-icons">
              <a href="https://slack.opencollective.com" className="soical">
                <FaSlack size="32" />
              </a>
              <a href="https://twitter.com/opencollect" className="soical">
                <FaTwitter size="32" />
              </a>
              <a href="http://github.com/backyourstack" className="soical">
                <FaGithub size="32" />
              </a>
            </div>
          </div>
          <div>
            <div className="tabs">
              <button
                className={activeTab === 'inquiries' ? 'tab active' : 'tab'}
                onClick={() => setActiveTab('inquiries')}
              >
                General inquiries
              </button>
              <button
                className={activeTab === 'betaTester' ? 'tab active' : 'tab'}
                onClick={() => setActiveTab('betaTester')}
              >
                Beta tester
              </button>
              <button
                className={activeTab === 'partnership' ? 'tab active' : 'tab'}
                onClick={() => setActiveTab('partnership')}
              >
                Partnership
              </button>
            </div>
            <div className="contactUsWrapper">
              {activeTab === 'inquiries' && <InquiriesForm />}
              {activeTab === 'betaTester' && <BecomeBetaTesterForm />}
              {activeTab === 'partnership' && <PartnershipForm />}
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        style={modalCustomStyle}
        onRequestClose={() => setIsOpen(false)}
        overlayClassName="modalOverlay"
      >
        <div>
          <PartnershipForm usedIn="modal" closeModal={() => setIsOpen(false)} />
        </div>
      </Modal>
    </Fragment>
  );
};

export default JoinUs;
