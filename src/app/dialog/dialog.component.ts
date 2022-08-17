import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  freshnessList = ["Brand new", "Second Hand", "Refurbished"];
  actionButton : string = 'Save';
  productForm:any = FormGroup;

  constructor(private formBuilder: FormBuilder,
              private api: ApiService, 
              private dialogRef: MatDialogRef<DialogComponent>,
              @Inject(MAT_DIALOG_DATA) public editData: any
            ) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName : ['', Validators.required],
      category: ['', Validators.required],
      freshness: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required],
    })

    if(this.editData){
      this.actionButton = 'Update';
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['date'].setValue(this.editData.date);
    }
  }

  addProduct(){
    if(!this.editData){
      if (this.productForm.valid) {
        this.api.postProduct(this.productForm.value).subscribe({
          next: (res) => {
            alert('Added Succesfully');
            this.productForm.reset();
            this.dialogRef.close('save');
          },
          error: (err: HttpErrorResponse) => alert(err.message)
        })
      }
    }else{
      this.updateProduct();
    }
  }

  updateProduct(){
    this.api.updateProduct(this.productForm.value, this.editData.id).subscribe({
      next: (res) =>{
        alert('Product updated Successfully');
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error: (err: HttpErrorResponse) => alert(err.message)
    })
  }

}
