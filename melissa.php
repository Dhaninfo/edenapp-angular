<?php
 header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
        header('Access-Control-Allow-Headers: token, Content-Type');
$address = $_GET['address'];
        $str_post = "?id=n7X2LmN1EBmprBxYNigXoC**nSAcwXpxhQ0PC2lXxuDAZ-**"
            . "&ff=" . urlencode($address)
            . "&format=json";
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt(
            $curl,
            CURLOPT_URL,
            "https://property.melissadata.net/v4/WEB/LookupProperty/".$str_post
        );
        $result = json_decode(curl_exec($curl));
        $propertyResult = json_encode($result);
       $data = json_decode($propertyResult, true);
        if (isset($data['Records'][0]['PropertySize']['AreaLotSF']) && $data['Records'][0]['PropertySize']['AreaLotSF'] != '') {
            echo json_encode(array('response' => 'success', 'data' => array('property_size'=>$data['Records'][0]['PropertySize']['AreaLotSF'])),200);die;
        }else{
            echo json_encode(['response' => 'success', 'data' => []]);die;
        }
