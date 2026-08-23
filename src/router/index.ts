import { createBrowserRouter } from 'react-router-dom'
import routes from './routes'
import { transformRoutes } from './transform'
export const router = createBrowserRouter(transformRoutes(routes))
