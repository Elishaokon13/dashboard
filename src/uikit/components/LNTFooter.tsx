import Link from 'next/link';
import {
	FaDiscord,
	FaTelegramPlane,
	FaTwitter,
} from 'react-icons/fa';
import Image from 'next/image';
import LogoSrc from 'assets/limitlesslogo.png'

const Logo = ({ path }) => {
	return (
		<Link legacyBehavior href={path}>
			<div className='logo'>
				<figure className='logo__img'>
					<Image src={LogoSrc} alt='' />
				</figure>
				<div className='logo__text'>
					<span>Limitless Network</span>
					
				</div>
			</div>
		</Link>
	);
};

const socialItems = [
	{ href: 'https://discord.gg/H4GEW4q7SJ', icon: <FaDiscord /> },
	{ href: 'https://t.me/limitless_Network_Token', icon: <FaTelegramPlane /> },
	{ href: 'https://twitter.com/Limitless_LNT', icon: <FaTwitter /> }
];

const Socials = () => {
	return (
		<div className="socials">
			{socialItems.map(({ href, icon }, i) => (
				<Link legacyBehavior href={href} key={i}>
					<a target='_blank' rel='noopener noreferrer'>
						{icon}
					</a>
				</Link>
			))}
		</div>
	);
};

const Divider = ({ type, w }) => {
	return (
		<div
			className={`divider ${type}`}
			style={{ width: w }}
		/>
	);
};

const LNTFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-wide-screen">
        <Logo path="/" />
        <div className="links">
          <Socials />
        </div>
        <Divider type="horizontal" w="188px" />
        <div className="copyright">
          <h3>Copyright &copy; {currentYear} All rights reserved.</h3>
          
        </div>
      </div>
    </footer>
  );
};

export default LNTFooter;
