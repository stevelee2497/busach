import styles from './index.less';
import images from '../../utils/images';
import Link from 'umi/link';

const Brand = ({ collapsed }) => (
  <div className={styles.brand}>
    <Link className={styles.logo} to="/">
      <img alt="logo" src={images.logo} />
      {collapsed ? null : <h1>Bu Sach</h1>}
    </Link>
  </div>
);

export default Brand;


