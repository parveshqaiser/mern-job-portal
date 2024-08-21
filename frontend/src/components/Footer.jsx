
import React from 'react';
import footer from "../../Images/footer.jpg";

import {faFacebook , faXTwitter , faInstagram , faLinkedinIn} from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Footer = () => {
    return (
    <div className="bg-black text-white py-3 px-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between mt-3">
            <div className="flex flex-col items-center md:items-start mb-6 md:mb-0 ">
                <img src={footer} className='w-24 mb-2 rounded-md' alt="Logo" />
                <div className="flex space-x-4 mt-3">
                    <a href='https://www.linkedin.com/feed/' target='blank'>
                        <FontAwesomeIcon title='Linkedin' icon={faLinkedinIn} className="text-blue-500 hover:text-blue-700 w-6 h-6 cursor-pointer" />
                    </a>
                    <a href='https://www.facebook.com/' target='blank'>
                        <FontAwesomeIcon  title='facebook' icon={faFacebook} className="text-blue-500 hover:text-blue-700 w-6 h-6 cursor-pointer" />
                    </a>
                    <a href='https://x.com/home' target='blank'>
                        <FontAwesomeIcon title='Twitter' icon={faXTwitter} className="text-blue-500 hover:text-blue-700 w-6 h-6 cursor-pointer" />
                    </a>
                    <a href='https://www.instagram.com/' target='blank'>
                        <FontAwesomeIcon title='Instagram' icon={faInstagram} className="text-blue-500 hover:text-blue-700 w-6 h-6 cursor-pointer" />
                    </a>
                </div>
            </div>

            <div className="flex flex-wrap gap-10  md:flex-row ">
                <div className='flex-1'>
                    <h2 className="text-xl font-semibold mb-2">Company</h2>
                    <ul>
                        <li className="mb-1"><a href="#">About Us</a></li>
                        <li className="mb-1"><a href="#">Careers</a></li>
                        <li className="mb-1"><a href="#">Help Center</a></li>
                        <li className="mb-1"><a href="#">Summons/Notices</a></li>
                    </ul>
                </div>
                <div className='flex-1'>
                    <h2 className="text-xl font-semibold mb-2">Support</h2>
                    <ul>
                        <li className="mb-1"><a href="#">Grievances</a></li>
                        <li className="mb-1"><a href="#">Report Issue</a></li>
                        <li className="mb-1"><a href="#">Privacy Policy</a></li>
                        <li className="mb-1"><a href="#">Terms & Conditions</a></li>
                    </ul>
                </div>
            </div>
        </div>

        <div className="text-center">
            <h1 className="text-xl text-orange-400 font-semibold">Monster.com</h1>
            <span className='text-orange-400'>All rights reserved © 2024 Info Edge (India) Ltd.</span>
        </div>
    </div>
    )
}

export default Footer;