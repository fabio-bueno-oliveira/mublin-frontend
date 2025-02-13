import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { gearInfos } from '../../store/actions/gear'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Flex, Title, Text, Skeleton } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import { useMediaQuery } from '@mantine/hooks'
import Header from '../../components/header'

function GearZoomPage () {

  const params = useParams()
  const productId = params?.productId
  const product = useSelector(state => state.gear)
  const largeScreen = useMediaQuery('(min-width: 60em)')
  let navigate = useNavigate()

  let dispatch = useDispatch()

  useEffect(() => {
    dispatch(gearInfos.getProductInfo(productId))
  }, [productId])

  return (
    <>
      {largeScreen &&
        <Header
          page='profile'
          username='Detalhes do item'
          profileId={product.id}
          showBackIcon={true}
          showDotsMenu={false}
        />
      }
      <Container size='lg' pt={largeScreen ? 4: 14} pb={14}>
        <Flex gap={12} align='center'>
          <IconX 
            // onClick={() => navigate(-1)} 
            onClick={() => navigate("/gear/product/"+productId)}
            className='point' 
          />
          <Flex direction='column'>
            <Text classNames='lhNormal' fw='420' size='xs' c='dimmed'>
              {product.requesting ? <Skeleton width={100} height={10} mb={4} radius="md" /> : product.categoryName + ' • ' + product.brandName}
            </Text>
            <Title fz='1rem' fw='560'>
              {product.requesting ? <Skeleton width={220} height={18} radius="md" /> : product.name}
            </Title>
          </Flex>
        </Flex>
      </Container>
      <iframe
        src={product.largePicture ? product.largePicture : undefined}
        title={product.name}
        className='fullScreen'
      />
    </>
  )
}

export default GearZoomPage