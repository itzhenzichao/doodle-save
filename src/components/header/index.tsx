import './index.scss';
import LogoPng from '../../assets/ty.png'
const DoodleHeader = () => {
  return (
    <div className='header'>
      <img className='header-logo' width={30} src={LogoPng} alt="" />
      <div className='header-title'>涂鸭</div>
    </div>
  );
};
export default DoodleHeader;