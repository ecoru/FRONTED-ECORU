import { Component } from "@angular/core";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
    selector: 'app-boleta',
    templateUrl: './boleta.component.html',
    styleUrl: './boleta.component.css'
})

export class BoletaComponent{
    //descargar
    Descargar() {
        const element = document.getElementById('comprobante');
        if (element) {
            html2canvas(element).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const doc = new jsPDF();
                const imgWidth = 210; // Ancho en mm para un documento A4
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                doc.save('IMPORTEC.pdf');
            });
        } else {
            return
        }
    }

     //imprimir 
     Imprimir() {
        const printContents = document.getElementById('comprobante')?.innerHTML;
        const originalContents = document.body.innerHTML;
        if (printContents) {
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
        } else {
            return
        }
    }
}