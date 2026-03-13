import VisibilityIcon from '@mui/icons-material/Visibility'
import AspectRatio from '@mui/joy/AspectRatio'
import Card from '@mui/joy/Card'
import CardOverflow from '@mui/joy/CardOverflow'
import Typography from '@mui/joy/Typography'
import { CssVarsProvider } from '@mui/joy/styles'
import { Box, Container, Stack } from '@mui/material'
import Divider from '../../components/divider'

import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'
import { serverApi } from '../../../lib/config'
import { ProductCollection } from '../../../lib/enums/product.enum'
import { Product } from '../../../lib/types/product'
import { retrieveNewDishes } from './selector'

const newDishesRetriever = createSelector(
  retrieveNewDishes,
  (newDishes) =>({newDishes})
);

export default function NewDishes() {

		const { newDishes } = useSelector(newDishesRetriever);
		
	console.log("popularDishes:", newDishes);

	return (
	<div className={'new-products-frame'}>
		<Container>
			<Stack className={"main"}>
				<Box className='category-title'>Fresh Menu</Box>
				<Stack className='cards-frame'>
					<CssVarsProvider>
						{newDishes.length !== 0 ? (
						newDishes.map((product:Product)=>{
							const imagePath = `${serverApi}/${product.productImages[0]}`;
							const sizeVolume = product.productCollection===ProductCollection.DRINK ?product.productVolume +"l" :  product.productSize + " size";
							return (
								<Card key={product._id} variant='outlined' className={"card"}>
									<CardOverflow>
										<div className='product-sale'>{sizeVolume}</div>
										<AspectRatio ratio='1'>
											<img src={imagePath} alt="" />
										</AspectRatio>
									</CardOverflow>

									<CardOverflow variant='soft' className= "product-detail">
										<Stack className='info'>
											<Stack flexDirection={"row"}>
												<Typography className={"title"}>
													{product.productName}
													</Typography>
													<Divider width='2' height='24' bg='#d9d9d9'/>
													<Typography className={"price"}>${product.productPrice}</Typography>
											</Stack>
											<Stack>
												<Typography className={"views"}>
													{product.productViews}
													<VisibilityIcon sx={{ fontSize: 20, marginLeft:"5px" }} />
												</Typography>
											</Stack>

										</Stack>
									</CardOverflow>

								</Card>
							);
						})
						) :(
							<Box className='no-data'>No new dishes</Box>
						)}
					</CssVarsProvider>
				</Stack>
			</Stack>
		</Container>
	</div>
	);
}
					