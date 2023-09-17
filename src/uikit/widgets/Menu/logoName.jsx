import Image from 'next/image';
import Link from 'next/link';
import logo from 'assets/images/Logo.png';

const LogoName = () => {
	return (
		<Link href={'/'}>
			<div className='logo'>
				<figure className='logo__img'>
					<Image src={logo} alt=''  width={50} height={50} />
				</figure>
				<div className='logo__text'>
					<span>Limitless Network</span>
					
				</div>
			</div>
		</Link>
	);
};

export default LogoName;
