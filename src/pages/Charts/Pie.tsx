
import { Header } from '../../components'
import Doughnut from '@/components/Charts/Pie'

const Pie = () => {
  return (
    <div className='m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl'>
      <Header category='Chart' title='Inflation Rate Pie' />
      <div className='w-full'>
        {/* <Doughnut /> */}
      </div>
    </div>
  )
}

export default Pie