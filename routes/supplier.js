var express = require('express');
var router = express.Router();

/* GET Supplier page. */

router.get('/', function(req, res, next) {
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM supplier',function(err,rows)
		{
			if(err)
				var errornya  = ("Error Selecting : %s ",err );   
			req.flash('msg_error', errornya);   
			res.render('supplier/list',{title:"Supplier",data:rows});
		});
         //console.log(query.sql);
     });
});

router.delete('/delete/(:code)', function(req, res, next) {
	req.getConnection(function(err,connection){
		var supplier = {
			code: req.params.code,
		}
		
		var delete_sql = 'delete from supplier where ?';
		req.getConnection(function(err,connection){
			var query = connection.query(delete_sql, supplier, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Delete : %s ",err);
					req.flash('msg_error', errors_detail); 
					res.redirect('/supplier');
				}
				else{
					req.flash('msg_info', 'Delete Supplier Success'); 
					res.redirect('/supplier');
				}
			});
		});
	});
});
router.get('/edit/(:code)', function(req,res,next){
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM supplier where code='+req.params.code,function(err,rows)
		{
			if(err)
			{
				var errornya  = ("Error Selecting : %s ",err );  
				req.flash('msg_error', errors_detail); 
				res.redirect('/supplier'); 
			}else
			{
				if(rows.length <=0)
				{
					req.flash('msg_error', "Supplier can't be find!"); 
					res.redirect('/supplier');
				}
				else
				{	
					console.log(rows);
					res.render('supplier/edit',{title:"Edit ",data:rows[0]});

				}
			}

		});
	});
});
router.put('/edit/(:code)', function(req,res,next){
	req.assert('name', 'Please fill the name').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
		v_name = req.sanitize( 'name' ).escape().trim(); 
		v_email = req.sanitize( 'email' ).escape().trim();
		v_address = req.sanitize( 'address' ).escape().trim();
		v_phone = req.sanitize( 'phone' ).escape();

		var supplier = {
			name: v_name,
			address: v_address,
			email: v_email,
			phone : v_phone
		}

		var update_sql = 'update supplier SET ? where code = '+req.params.code;
		req.getConnection(function(err,connection){
			var query = connection.query(update_sql, supplier, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Update : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('supplier/edit', 
					{ 
						name: req.param('name'), 
						address: req.param('address'),
						email: req.param('email'),
						phone: req.param('phone'),
					});
				}else{
					req.flash('msg_info', 'Update supplier success'); 
					res.redirect('/supplier/edit/'+req.params.code);
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "<p>Sory there are error</p><ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('supplier/add-supplier', 
		{ 
			name: req.param('name'), 
			address: req.param('address')
		});
	}
});

router.post('/add', function(req, res, next) {
	req.assert('name', 'Please fill the name').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {

		v_name = req.sanitize( 'name' ).escape().trim(); 
		v_email = req.sanitize( 'email' ).escape().trim();
		v_address = req.sanitize( 'address' ).escape().trim();
		v_phone = req.sanitize( 'phone' ).escape();

		var supplier = {
			name: v_name,
			address: v_address,
			email: v_email,
			phone : v_phone
		}

		var insert_sql = 'INSERT INTO supplier SET ?';
		req.getConnection(function(err,connection){
			var query = connection.query(insert_sql, supplier, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Insert : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('supplier/add-supplier', 
					{ 
						name: req.param('name'), 
						address: req.param('address'),
						email: req.param('email'),
						phone: req.param('phone'),
					});
				}else{
					req.flash('msg_info', 'Create supplier success'); 
					res.redirect('/supplier');
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "<p>Sorry there are error</p><ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('supplier/add-supplier', 
		{ 
			name: req.param('name'), 
			address: req.param('address')
		});
	}

});

router.get('/add', function(req, res, next) {
	res.render(	'supplier/add-supplier', 
	{ 
		title: 'Add New Supplier',
		name: '',
		email: '',
		phone:'',
		address:''
	});
});



module.exports = router;
